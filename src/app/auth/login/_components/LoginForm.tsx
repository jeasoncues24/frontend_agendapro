"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { customToast } from "@/components/ui/custom-toast"
import Cookies from "js-cookie"
import SignButton from "./SingButton"

export default function LoginForm() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [agreeToTerms, setAgreeToTerms] = useState(false)
    const [isDisable, setIsDisable] = useState(true);
    const [pending, setPending] = useState(false);
    const [showTermsError, setShowTermsError] = useState(false);

    useEffect(() => {
        if ( email !== '' && password !== '' ) {
            setIsDisable(false);
        } else {
            setIsDisable(true);
        }
    }, [email, password])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if ( !agreeToTerms ) {
            setShowTermsError(true);
            return customToast.error({
                title: "Error al iniciar sesión",
                description: `Debe aceptar los términos y condiciones`,
            })
        }

        if ( email === '' || password === '' ) {
            return customToast.error({
                title: "Error al iniciar sesión",
                description: `Debe ingresar correo y contraseña para iniciar sesión`,
            })
        } 

        const params = {
            email,
            password
        };

        try {
            const endpoint = process.env.NODE_ENV === 'production'
                ? process.env.NEXT_PUBLIC_ENDPOINT_API_PROD
                : process.env.NEXT_PUBLIC_ENDPOINT_API_DEV;

            const response = await fetch(`${endpoint}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            const data = await response.json();
            if (!response.ok) {
                setPending(false);
                if (data.status === 'error') {
                    return customToast.error({
                        title: "Error al iniciar sesión",
                        description: `${data.message}`,
                    })
                }
                return customToast.error({
                    title: "Error al iniciar sesión",
                    description: `${data.message}, vuelve a intentarlo`,
                })
            }

         
            setPending(true);
            const token = data.data.token;
            const uuid = data.data.user;
            const user = JSON.stringify(data.data.user);
            const expiresInMinutes = 120;
            const expiresAt = new Date();

            expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

            Cookies.set('authtoken', token, { expires: expiresAt });
            Cookies.set('user', user, { expires: expiresAt })

            if (uuid.role_id === 1) {
                window.location.replace('/admin/cpanel/dashboard');
            } else if (uuid.company && uuid.company.id) {
                if ( uuid.role_id === 2 || uuid.role_id === 3 ) {
                    window.location.replace(`/${uuid.company.id}/branch-management`);
                } else {
                    window.location.replace(`/${uuid.company.id}/cash`);
                }
            }
        } catch ( error ) {
            customToast.error({
                title: "Error al iniciar sesión",
                description: `Ocurrió un problema al intentar iniciar sesión. Por favor, inténtalo de nuevo.`,
            })
            setPending(false)
        }
    }

    const handleGoogleLogin = () => {
        console.log("Google login")
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <Input
                        type="email"
                        placeholder="Ingresa tu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 pr-12 border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 rounded-xl text-gray-900 placeholder:text-gray-400"
                        required
                    />

                    <Input
                        type="password"
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 pr-12 border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 rounded-xl text-gray-900 placeholder:text-gray-400 mt-2"
                        required
                    />

                    <SignButton
                        pending={pending}
                        initialIsDisable={isDisable}
                    />

                </div>
            </form>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">OTRA OPCIÓN</span>
                </div>
            </div>

            {/* Google login */}
            <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all duration-200"
            >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                Continuar con Google
            </Button>

            {/* Terms and conditions */}
            <div className={`space-y-3 border p-2 rounded-xl transition-colors duration-200 ${showTermsError ? 'border-pink-500' : 'border-gray-200'}`}>
                <div className="flex items-start space-x-3">
                    <Checkbox
                        id="terms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) => {
                            setAgreeToTerms(checked as boolean);
                            if (checked) {
                                setShowTermsError(false);
                            }
                        }}
                        className="mt-0.5 border-2 border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                        Estoy de acuerdo con los{" "}
                        <Link href="/terms" className="text-blue-500 hover:text-blue-600 underline underline-offset-2">
                            términos y condiciones
                        </Link>
                    </Label>
                </div>

                <div className="text-xs text-gray-500 leading-relaxed">
                    Acepto las Condiciones del servicio y reconozco que he revisado la Política de privacidad de AgendaPro.
                </div>
            </div>
        </>
    )
}