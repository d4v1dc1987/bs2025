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

    // List all files in the user's folder
    const { data: files, error: listError } = await supabase.storage
      .from('avatars')
      .list(userId)

    if (listError) {
      console.error('Error listing files:', listError)
      return new Response(
        JSON.stringify({ error: 'Failed to list files' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Get the current avatar filename from the URL if it exists
    const currentAvatarPath = currentAvatarUrl ? new URL(currentAvatarUrl).pathname.split('/').pop() : null

    // Filter out the current avatar and delete all other files
    const filesToDelete = files
      .map(file => `${userId}/${file.name}`)
      .filter(filePath => {
        const fileName = filePath.split('/').pop()
        return fileName !== currentAvatarPath
      })

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
    }

    return new Response(
      JSON.stringify({ 
        message: 'Cleanup completed successfully',
        deletedCount: filesToDelete.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})