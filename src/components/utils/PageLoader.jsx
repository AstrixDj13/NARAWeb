// import classes from "./PageLoader.module.css";

export default function PageLoader(){
    return (
    <div className="w-screen h-screen flex items-center justify-center ">
      {/* <div className={classes.loading}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div> */}
      <img title="image" src="/cat.gif" alt="" />
    </div>
    )
}