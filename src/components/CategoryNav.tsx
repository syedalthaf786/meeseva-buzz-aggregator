
import { Button } from "@/components/ui/button";
import { NewsCategory } from "@/types/news";

interface CategoryNavProps {
  selectedCategory: NewsCategory | null;
  onSelectCategory: (category: NewsCategory | null) => void;
}

const CategoryNav = ({ selectedCategory, onSelectCategory }: CategoryNavProps) => {
  const categories: Array<{ value: NewsCategory | null; label: string }> = [
    { value: null, label: "Top Headlines" },
    { value: "general", label: "General" },
    { value: "business", label: "Business" },
    { value: "technology", label: "Technology" },
    { value: "entertainment", label: "Entertainment" },
    { value: "health", label: "Health" },
    { value: "science", label: "Science" },
    { value: "sports", label: "Sports" },
  ];

  return (
    <div className="overflow-x-auto py-3 border-b border-gray-200 bg-white">
      <div className="container px-4 mx-auto">
        <div className="flex space-x-1 min-w-max">
          {categories.map((category) => (
            <Button
              key={category.label}
              variant={selectedCategory === category.value ? "default" : "ghost"}
              className={`rounded-full ${
                selectedCategory === category.value
                  ? "bg-meeseva-blue hover:bg-meeseva-blue/90"
                  : "text-meeseva-darkGray hover:bg-gray-100"
              }`}
              onClick={() => onSelectCategory(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
