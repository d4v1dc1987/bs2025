import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the user ID and new avatar URL from the request
    const { userId, currentAvatarUrl } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Starting cleanup for user ${userId}`)
    console.log(`Current avatar URL: ${currentAvatarUrl}`)

    // 1. Get all files in the user's directory
    const { data: userFiles, error: listError } = await supabase.storage
      .from('avatars')
      .list(userId, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      })

    if (listError) {
      console.error('Error listing files:', listError)
      return new Response(
        JSON.stringify({ error: 'Failed to list files' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log(`Found ${userFiles?.length || 0} files in user directory`)

    // Get the current avatar filename from the URL if it exists
    const currentAvatarPath = currentAvatarUrl ? new URL(currentAvatarUrl).pathname.split('/').pop() : null
    console.log(`Current avatar filename: ${currentAvatarPath}`)

    // Delete all files except the current avatar
    const filesToDelete = userFiles
      ?.filter(file => file.name !== currentAvatarPath)
      .map(file => `${userId}/${file.name}`) || []

    console.log(`Files to delete for user ${userId}: ${filesToDelete.length}`)
    
    if (filesToDelete.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove(filesToDelete)

      if (deleteError) {
        console.error('Error deleting files:', deleteError)
        return new Response(
          JSON.stringify({ error: 'Failed to delete files' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      console.log(`Successfully deleted ${filesToDelete.length} old avatar files for user ${userId}`)
    }

    // 2. Clean up folders for deleted users
    const { data: activeUsers, error: usersError } = await supabase
      .from('profiles')
      .select('id')

    if (usersError) {
      console.error('Error fetching active users:', usersError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch active users' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Get all folders in the avatars bucket
    const { data: allFolders, error: foldersError } = await supabase.storage
      .from('avatars')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      })

    if (foldersError) {
      console.error('Error listing folders:', foldersError)
      return new Response(
        JSON.stringify({ error: 'Failed to list folders' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const activeUserIds = activeUsers.map(user => user.id)
    const inactiveFolders = allFolders
      ?.filter(folder => !activeUserIds.includes(folder.name))
      .map(folder => folder.name) || []

    console.log(`Found ${inactiveFolders.length} inactive user folders`)

    // Delete all files in folders of inactive users
    for (const folderId of inactiveFolders) {
      const { data: folderFiles } = await supabase.storage
        .from('avatars')
        .list(folderId)

      if (folderFiles && folderFiles.length > 0) {
        const filePaths = folderFiles.map(file => `${folderId}/${file.name}`)
        
        const { error: cleanupError } = await supabase.storage
          .from('avatars')
          .remove(filePaths)

        if (cleanupError) {
          console.error(`Error cleaning up folder ${folderId}:`, cleanupError)
        } else {
          console.log(`Cleaned up folder for inactive user ${folderId}`)
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Cleanup completed successfully',
        deletedFiles: filesToDelete.length,
        cleanedFolders: inactiveFolders.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})