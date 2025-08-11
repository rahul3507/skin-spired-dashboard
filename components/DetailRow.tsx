interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex justify-between border-b border-[#D1D5DB] py-2 ">
      <span className="text-[#E6E6E6]">{label}</span>
      <span className="font-medium text-[#E6E6E6]">{value}</span>
    </div>
  );
}
export default DetailRow;
