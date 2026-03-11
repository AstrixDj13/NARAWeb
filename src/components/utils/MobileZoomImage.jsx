import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function MobileZoomImage({ img, isPriority }) {
    return (
        <div className="relative w-full h-full">
            {/* UX Hint */}
            <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded z-10">
                Pinch to zoom
            </div>

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
                <TransformComponent>
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
