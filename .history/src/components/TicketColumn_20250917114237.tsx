interface TicketColumnProps{
    title: string;
    tickets: TicketCardProps[];
}

export const TicketColumn = ({title, tickets}: TicketColumnProps) =>{
    return (
        <div className="flex flex-col bg-gray-100 rounded-2xl p-4 w-80">
            
        </div>
    );
}