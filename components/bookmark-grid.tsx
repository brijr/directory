import React from "react";

export const BookmarkGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <CategoryFilter />
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

const CategoryFilter = () => {
  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3">Hello World!</div>
  );
};
