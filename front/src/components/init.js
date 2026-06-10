import { useCallback, useEffect } from "react"
import { useGeneralStore } from "@/lib/stores/useGeneralStore"

export default function Init() {

    const { setIsMob, setIsTablet } = useGeneralStore()

    const setVhUnic = useCallback(() => {

        const vh = window.innerHeight * 0.01
        document.querySelector('body').style.cssText += `--vhu: ${vh}px`

    }, [])

    const setVh = useCallback(() => {

        const vh = window.innerHeight * 0.01
        document.querySelector('body').style.cssText += `--vh: ${vh}px`

    }, [])

    const testMob = useCallback(() => {

        if (window.innerWidth < 800) {
            setIsMob(true)
        } else {
            setIsMob(false)
        }

        if (window.innerWidth < 1000) {
            setIsTablet(true)
        } else {
            setIsTablet(false)
        }

        setVh()

    }, [setIsMob, setIsTablet, setVh])

    useEffect(() => {

        setVhUnic()
        testMob()

        window.addEventListener('resize', testMob)

        return () => {
            window.removeEventListener('resize', testMob)
        }

    }, [testMob, setVhUnic])

    return <></>

}