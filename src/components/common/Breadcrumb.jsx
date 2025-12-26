import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ items }) => {
    return (
        <div className="flex gap-4 font-outfit text-sm md:text-base mb-6">
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {index < items.length - 1 ? (
                        <Link className="underline flex items-center gap-3" to={item.link}>
                            {item.label} <img title="image" src="/icons/leftTriangleIcon.svg" alt="" />
                        </Link>
                    ) : (
                        <span className="text-[#656565]">{item.label}</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Breadcrumb;
