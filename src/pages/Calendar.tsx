import { Calendar as CalendarIcon } from "lucide-react";

const Calendar = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Calendrier social</h1>
      </div>
      <p className="text-muted-foreground">
        Planifie tes publications avec le calendrier interactif.
      </p>
    </div>
  );
};

export default Calendar;