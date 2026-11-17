import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function MobileZoomImage({ img, isPriority }) {
    return (
        <div className="relative w-full h-full">

            <TransformWrapper
                minScale={1}
                maxScale={4}
                initialScale={1}
                centerOnInit
                doubleClick={{ mode: "zoomIn" }}
                wheel={{ disabled: true }}
                pinch={{ step: 6 }}
                panning={{ velocityDisabled: true }}
            >
                <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%" }}>
                    <img
                        src={img}
                        alt="product"
                        draggable={false}
                        fetchpriority={isPriority ? "high" : "auto"}
                        loading={isPriority ? "eager" : "lazy"}
                        className="w-full h-full object-cover"
                    />
                </TransformComponent>
            </TransformWrapper>
        </div>
    );
}
