
export default async function ConfirmedLayout({
    children
   }: {
    children: React.ReactNode;
   }) {
       
     return (
       <div className="flex justify-center bg-white">
         <div className="w-full sm:w-[500px] px-10">
           { children }
         </div>
       </div>
     );
   }