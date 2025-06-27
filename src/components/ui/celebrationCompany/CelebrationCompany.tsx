"use client";

import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';


interface CheckmarkProps {
    size?: number
    strokeWidth?: number
    color?: string
    className?: string
}


const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: {
                delay: i * 0.2,
                type: "spring",
                duration: 1.5,
                bounce: 0.2,
                ease: "easeInOut",
            },
            opacity: { delay: i * 0.2, duration: 0.2 },
        },
    }),
}

export function Checkmark({ size = 100, strokeWidth = 2, color = "currentColor", className = "", onAnimationComplete }: CheckmarkProps & { onAnimationComplete?: () => void }) {
    return (
        <div className=' flex mx-auto justify-center items-center rounded-full w-24 h-24'>
            <motion.svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                initial="hidden"
                animate="visible"
                className={className}
                onAnimationComplete={onAnimationComplete}
            >
                <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={color}
                    variants={draw}
                    custom={0}
                    style={{
                        strokeWidth,
                        strokeLinecap: "round",
                        fill: "transparent",
                    }}
                />
                <motion.path
                    d="M30 50L45 65L70 35"
                    stroke={color}
                    variants={draw}
                    custom={1}
                    style={{
                        strokeWidth,
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        fill: "transparent",
                    }}
                />
            </motion.svg>
        </div>
    )
}


export default function CelebrationCompany({
    companyName = "Tu empresa",
    creationDate = new Date(),
    founderName = "Fundador",
    mission = "Nuestra misión es crear un impacto positivo en el mundo."
}: {
    companyName?: string,
    creationDate?: Date,
    founderName?: string,
    mission?: string
}) {
    const [animationComplete, setAnimationComplete] = useState(false)
    const [redirecting, setRedirecting] = useState(false)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const [showConfetti, setShowConfetti] = useState(true)
    const [showCard, setShowCard] = useState(true)
    const router = useRouter();

    useEffect(() => {
        const { innerWidth: width, innerHeight: height } = window
        setDimensions({ width, height })

        const timer = setTimeout(() => {
            setShowConfetti(false)
        }, 2000)
        
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight })
        }

        window.addEventListener('resize', handleResize)

        return () => {
            clearTimeout(timer)
            window.removeEventListener('resize', handleResize)
        }
    }, [])


    useEffect(() => {
        if (animationComplete) {
            setTimeout(() => {
                setRedirecting(true)
                router.push('/auth/login')
            }, 2000)
        }
    }, [animationComplete, router])

    const handleAnimationComplete = () => {
        setTimeout(() => {
            setAnimationComplete(true)
        }, 500)
    }


    console.log(animationComplete)

    return (
        <div className="flex items-center justify-center p-4 ">
            {showConfetti && (
                <Confetti
                    width={dimensions.width}
                    height={dimensions.height}
                    colors={['#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F5A020']}
                    numberOfPieces={150}
                />
            )}
            <AnimatePresence>
                {showCard && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-xl max-w-lg w-full overflow-hidden"
                    >
                        <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-black">
                            <button
                                onClick={() => setShowCard(false)}
                                className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
                                aria-label="Cerrar"
                            >
                                <X size={24} />
                            </button>
                            { 
                                !animationComplete ? ( 
                                    <>
                                        <Checkmark
                                            size={80}
                                            strokeWidth={4}
                                            color="rgb(16 185 129)"
                                            className="relative z-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                                            onAnimationComplete={handleAnimationComplete}
                                        />
                                        <h1 className="text-2xl font-semibold text-center mb-2">
                                            ¡{companyName} se ha creado correctamente!
                                        </h1>
                                        <p className="text-center text-sm text-gray-500">
                                            Una nueva aventura comienza hoy.
                                        </p>
                                    </>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center gap-2"
                                    >
                                        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
                                        <p className="text-zinc-900 text-sm font-medium">Redireccionando al login...</p>
                                    </motion.div>
                                )
                            }
                          
                            
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

