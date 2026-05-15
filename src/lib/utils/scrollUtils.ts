import { ScrollTrigger } from "gsap/ScrollTrigger"

export const refreshScroll = () => {
    if (typeof window !== "undefined") {
        requestAnimationFrame(() => {
            ScrollTrigger.refresh()
        })
    }
}