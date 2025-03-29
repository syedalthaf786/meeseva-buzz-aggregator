
import { useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-meeseva-blue">
              MeeSeva <span className="text-meeseva-lightBlue">News</span>
            </h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu />
          </Button>
        </div>
        
        <div className={`mt-4 md:mt-0 md:flex md:items-center space-y-4 md:space-y-0 md:space-x-4 ${isMenuOpen ? 'block' : 'hidden md:flex'}`}>
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px] md:min-w-[300px]">
            <Input
              type="search"
              placeholder="Search news..."
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute top-0 right-0"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
