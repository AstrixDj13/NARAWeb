import CategoryPill from "./category-pill"

const Categories = () => {
  return (
    <div>
      <div className="flex gap-2 items-center justify-start overflow-auto px-2 md:justify-center"
        style={{ overflowY: 'scroll', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        <CategoryPill name={"New arrivals"} />
        <CategoryPill name={"Women"} />
        <CategoryPill name={"Cord sets"} />
        <CategoryPill name={"Jackets"} />
        <CategoryPill name={"Accessories"} />
      </div>
    </div>
  )
}

export default Categories