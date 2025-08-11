import RichCard from "@/components/share/RichCard";
import { Plus } from "lucide-react";
import Link from "next/link";

const issues = [
  { id: 1, title: "FQL Method For Pool", icon: "/issue/1.png" },
  { id: 2, title: "Chemical Parameters", icon: "/issue/2.png" },
  { id: 3, title: "Wash The Filter", icon: "/issue/3.png" },
  { id: 4, title: "How Many Filter", icon: "/issue/4.png" },
  { id: 5, title: "Thr Green Pool", icon: "/issue/5.png" },
  { id: 6, title: "Have Cloudy Pool", icon: "/issue/6.png" },
  { id: 7, title: "Algae In Pool", icon: "/issue/7.png" },
  { id: 8, title: "How Raise PH", icon: "/issue/8.png" },
];

export default function Maintenance() {
  return (
    <div className='min-h-screen bg-black p-4 md:p-6'>
      <div className='w-full mx-auto'>
        <div className='flex justify-end mb-6'>
          <Link
            href='/issues/create'
            className='flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-[#E6E6E6] rounded-full px-4 py-2 transition-colors'
          >
            <Plus size={20} className='text-[#E6E6E6]' />
            <span>Add Frequment</span>
          </Link>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
          {issues.map((issue) => (
            <RichCard key={issue.id} title={issue.title} icon={issue.icon} />
          ))}
        </div>
      </div>
    </div>
  );
}
