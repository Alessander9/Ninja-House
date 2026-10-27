import React, { useState, useEffect, useRef, type HTMLAttributes } from 'react';

// A simple utility for conditional class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
}

// Define the type for a single gallery item
export interface GalleryItem {
  common: string;
  binomial: string;
  photo: {
    url: string; 
    text: string;
    pos?: string;
    by: string;
  };
  video?: string;
  link?: string;
  badge?: string;
  time?: string;
  color?: string;
}

// Define the props for the CircularGallery component
export interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  /** Controls how far the items are from the center. (If omitted, calculated responsively) */
  radius?: number;
  /** Controls the speed of auto-rotation when not scrolling. */
  autoRotateSpeed?: number;
  /** Width for 16:9 aspect ratio (If omitted, calculated responsively) */
  itemWidth?: number;
  /** Height for 16:9 aspect ratio (If omitted, calculated responsively) */
  itemHeight?: number;
  /** Optional callback when an item is clicked */
  onItemClick?: (item: GalleryItem) => void;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ 
    items, 
    className, 
    radius: propRadius, 
    autoRotateSpeed = 0.08, 
    itemWidth: propItemWidth, 
    itemHeight: propItemHeight, 
    onItemClick, 
    ...props 
  }, ref) => {
    const [rotation, setRotation] = useState(0);
    const [isInteracting, setIsInteracting] = useState(false);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Responsive dimensions
    const [responsiveDim, setResponsiveDim] = useState(() => {
      if (typeof window === 'undefined') {
        return { width: 460, height: 259, radius: 560, perspective: 1800 };
      }
      const w = window.innerWidth;
      if (w < 480) {
        // Mobile (iPhone / small Android)
        const width = Math.min(Math.round(w * 0.82), 310);
        return { width, height: Math.round(width * 9 / 16), radius: 310, perspective: 1100 };
      } else if (w < 768) {
        // Large Mobile / Phablet
        const width = Math.min(Math.round(w * 0.7), 380);
        return { width, height: Math.round(width * 9 / 16), radius: 410, perspective: 1400 };
      } else if (w < 1024) {
        // Tablet (iPad, etc.)
        const width = 420;
        return { width, height: Math.round(width * 9 / 16), radius: 480, perspective: 1600 };
      } else {
        // Desktop
        const width = 480;
        return { width, height: 270, radius: 580, perspective: 2000 };
      }
    });

    useEffect(() => {
      const handleResize = () => {
        const w = window.innerWidth;
        if (w < 480) {
          const width = Math.min(Math.round(w * 0.82), 310);
          setResponsiveDim({ width, height: Math.round(width * 9 / 16), radius: 310, perspective: 1100 });
        } else if (w < 768) {
          const width = Math.min(Math.round(w * 0.7), 380);
          setResponsiveDim({ width, height: Math.round(width * 9 / 16), radius: 410, perspective: 1400 });
        } else if (w < 1024) {
          setResponsiveDim({ width: 420, height: Math.round(420 * 9 / 16), radius: 480, perspective: 1600 });
        } else {
          setResponsiveDim({ width: 480, height: 270, radius: 580, perspective: 2000 });
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const itemWidth = propItemWidth || responsiveDim.width;
    const itemHeight = propItemHeight || responsiveDim.height;
    const radius = propRadius || responsiveDim.radius;
    const perspective = responsiveDim.perspective;

    // Effect to handle scroll-based rotation
    useEffect(() => {
      const handleScroll = () => {
        setIsInteracting(true);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        const scrollRotation = scrollProgress * 360 * 3;
        setRotation(scrollRotation);

        scrollTimeoutRef.current = setTimeout(() => {
          setIsInteracting(false);
        }, 140);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, []);

    // Touch & Drag interactions (mobile swipe and mouse drag)
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const startRotRef = useRef(0);
    const hasDraggedRef = useRef(false);

    const onPointerDown = (e: React.PointerEvent) => {
      isDraggingRef.current = true;
      hasDraggedRef.current = false;
      setIsInteracting(true);
      startXRef.current = e.clientX;
      startRotRef.current = rotation;
    };

    const onPointerMove = (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - startXRef.current;
      if (Math.abs(deltaX) > 6) {
        hasDraggedRef.current = true;
      }
      const sensitivity = window.innerWidth < 640 ? 0.45 : 0.28;
      setRotation(startRotRef.current + deltaX * sensitivity);
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
      setTimeout(() => setIsInteracting(false), 200);
    };

    // Effect for auto-rotation when not scrolling or dragging
    useEffect(() => {
      const autoRotate = () => {
        if (!isInteracting) {
          setRotation(prev => prev + autoRotateSpeed);
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };

      animationFrameRef.current = requestAnimationFrame(autoRotate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isInteracting, autoRotateSpeed]);

    const anglePerItem = 360 / items.length;
    const halfWidth = Math.round(itemWidth / 2);
    const halfHeight = Math.round(itemHeight / 2);
    
    return (
      <div
        ref={ref}
        role="region"
        aria-label="Circular 3D Gallery"
        className={cn(
          "relative w-full h-full flex items-center justify-center select-none touch-pan-y cursor-grab active:cursor-grabbing",
          className
        )}
        style={{ perspective: `${perspective}px` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.25, 1 - (normalizedAngle / 180));

            return (
              <div
                key={item.photo.url} 
                role="group"
                aria-label={item.common}
                className="absolute cursor-pointer aspect-video"
                onClick={() => {
                  if (!hasDraggedRef.current && onItemClick) {
                    onItemClick(item);
                  }
                }}
                style={{
                  width: `${itemWidth}px`,
                  height: `${itemHeight}px`,
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  marginLeft: `-${halfWidth}px`,
                  marginTop: `-${halfHeight}px`,
                  opacity: opacity,
                  transition: isDraggingRef.current ? 'opacity 0.15s linear' : 'opacity 0.3s linear, transform 0.2s ease'
                }}
              >
                {/* Contenedor del video en proporción 16:9 (aspect-video) */}
                <div 
                  className="relative w-full h-full aspect-video rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden group border border-white/10 bg-black/60 backdrop-blur-lg hover:border-ninja-green/60 transition-all duration-300 hover:scale-[1.02]"
                  style={item.color ? { borderColor: `${item.color}50` } : undefined}
                >
                  {/* Video o Imagen en proporción 16:9 exacta */}
                  {item.video ? (
                    <video
                      src={item.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster={item.photo.url}
                      className="absolute inset-0 w-full h-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                    />
                  ) : (
                    <img
                      src={item.photo.url}
                      alt={item.photo.text}
                      className="absolute inset-0 w-full h-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                      style={{ objectPosition: item.photo.pos || 'center' }}
                    />
                  )}

                  {/* Subtle top badge if available */}
                  {item.badge && (
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 pointer-events-none">
                      <span 
                        className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] md:text-[11px] font-display font-black tracking-wider uppercase bg-black/75 backdrop-blur-md border border-white/15"
                        style={item.color ? { color: item.color, borderColor: `${item.color}60` } : undefined}
                      >
                        {item.badge}
                      </span>
                    </div>
                  )}

                  {/* Gradient overlay for texts */}
                  <div className="absolute bottom-0 left-0 w-full p-2.5 sm:p-3.5 md:p-5 bg-gradient-to-t from-black via-black/85 to-transparent text-white text-left z-10 pointer-events-none">
                    <h2 className="text-sm sm:text-base md:text-xl font-display font-black leading-tight drop-shadow-md group-hover:text-ninja-green transition-colors truncate">
                      {item.common}
                    </h2>
                    <em className="text-[9.5px] sm:text-[11px] md:text-xs font-sans not-italic block opacity-85 mt-0.5 leading-snug text-white/80 line-clamp-1">
                      {item.binomial}
                    </em>
                    {item.time ? (
                      <p className="text-[8.5px] sm:text-[10px] md:text-[11px] font-sans mt-0.5 sm:mt-1 opacity-90 text-white/90 font-medium truncate">
                        ⏰ {item.time}
                      </p>
                    ) : item.photo.by ? (
                      <p className="text-[8.5px] sm:text-[10px] font-sans mt-0.5 opacity-70 text-white/70 truncate">
                        {item.photo.by}
                      </p>
                    ) : null}

                    {item.link && (
                      <div className="mt-1 sm:mt-2 hidden sm:inline-flex items-center gap-1.5 text-[11px] font-display font-bold text-ninja-green opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Ver Programa</span>
                        <span>→</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };
export default CircularGallery;
