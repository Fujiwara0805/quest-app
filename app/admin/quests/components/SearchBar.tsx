import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  return (
    <div className="relative w-full sm:max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <FaSearch className="text-gray-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="クエストを検索..."
        className="w-full bg-[#3a2820] border border-[#C0A172] p-3 pl-10 rounded-md text-white placeholder:text-gray-400"
      />
    </div>
  );
}
