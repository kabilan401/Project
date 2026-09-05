import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Laptop, 
  Calculator, 
  ShoppingBag, 
  Home, 
  Bike, 
  Shirt, 
  PenTool, 
  FlaskConical,
  Trophy,
  Package 
} from 'lucide-react';

const iconMap = {
  BookOpen,
  Laptop,
  Calculator,
  ShoppingBag,
  Home,
  Bike,
  Shirt,
  PenTool,
  FlaskConical,
  Trophy,
  Package
};

export const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  const IconComponent = iconMap[category.iconName] || Package;

  const handleClick = () => {
    navigate(`/marketplace?category=${encodeURIComponent(category.name)}`);
  };

  return (
    <div className="category-card" onClick={handleClick}>
      <div 
        className="category-icon-box"
        style={{ backgroundColor: category.bg, color: category.color }}
      >
        <IconComponent size={26} />
      </div>
      <h3 className="category-name">{category.name}</h3>
      <span className="category-count">{category.count}+ Listings</span>
    </div>
  );
};
