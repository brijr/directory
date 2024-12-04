import React from "react";

export const BookmarkGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="fade-in h-full"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};
