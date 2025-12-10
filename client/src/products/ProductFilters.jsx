import { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Checkbox } from '../components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const ProductFilters = ({
  categories,
  subcategories,
  selectedCategories,
  selectedSubcategories,
  onCategoryChange,
  onSubcategoryChange,
  onResetFilters,
  priceRange = [0, 500],
  onPriceChange,
}) => {
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedSubcategories.length > 0 ||
    localPriceRange[0] > 0 ||
    localPriceRange[1] < 500;

  const handlePriceChange = (values) => {
    const newRange = [values[0], values[1]];
    setLocalPriceRange(newRange);
    onPriceChange?.(newRange);
  };

  const handleReset = () => {
    setLocalPriceRange([0, 500]);
    onResetFilters();
  };

  return (
    <div className="space-y-6">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
          >
            <X className="w-4 h-4" />
            Reset all
          </button>
        )}
      </div>

      {/* Category Dropdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Category</h4>
        <Select
          value={selectedCategories[0] || ''}
          onValueChange={(value) => {
            if (value === 'all') {
              selectedCategories.forEach((cat) => onCategoryChange(cat));
            } else {
              selectedCategories.forEach((cat) => onCategoryChange(cat));
              if (value) onCategoryChange(value);
            }
          }}
        >
          <SelectTrigger className="w-full bg-card border-border hover:border-primary/50 transition-colors">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subcategory Checkboxes */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground">Subcategory</h4>
        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
          {subcategories.map((subcategory) => (
            <motion.label
              key={subcategory}
              whileHover={{ x: 2 }}
              className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-muted/50 transition-all group"
            >
              <Checkbox
                checked={selectedSubcategories.includes(subcategory)}
                onCheckedChange={() => onSubcategoryChange(subcategory)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span
                className={`text-sm transition-colors ${
                  selectedSubcategories.includes(subcategory)
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground group-hover:text-foreground'
                }`}
              >
                {subcategory}
              </span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-1.5">
            {selectedCategories.map((cat) => (
              <span
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full cursor-pointer hover:bg-primary/20 transition-colors"
              >
                {cat}
                <X className="w-3 h-3" />
              </span>
            ))}
            {selectedSubcategories.map((sub) => (
              <span
                key={sub}
                onClick={() => onSubcategoryChange(sub)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-accent/20 text-accent-foreground text-xs rounded-full cursor-pointer hover:bg-accent/30 transition-colors"
              >
                {sub}
                <X className="w-3 h-3" />
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
