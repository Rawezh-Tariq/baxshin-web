import type { NextPage } from 'next'
import Head from 'next/head'
import { getAuth, ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useEffect, useState } from 'react'
import { useAuth } from '../lib/firebase/firebaseAuthProvider'
import { useRouter } from 'next/router';
import { getFirestore, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { placesCol, usersCol } from '../lib/firebase/firestore/db';
import { Alert, Button, Input } from '@mantine/core';
import { AlertCircle, Hash, Phone } from 'tabler-icons-react';
import { useNotifications } from '@mantine/notifications';
import Link from 'next/link';


const SignIn: NextPage = () => {
    const { user, loading } = useAuth()
    const router = useRouter();
    const notifications = useNotifications();
    const [phoneNumber, setnumber] = useState("");
    const [myerror, setError] = useState("");
    const [otp, setotp] = useState('');
    const [show, setshow] = useState(false);
    const [final, setfinal] = useState<ConfirmationResult>();

    const myauth = getAuth()

    useEffect(() => {
        if (user) router.push((router.query.redirect || '/').toString());
    }, [router, user]);

    const signin = async () => {
        setError('');
        if (phoneNumber === "" || phoneNumber.length < 10 || isNaN(Number(phoneNumber))) {
            setError('ژمارەی مۆبایلی دروست بەکاربێنە');
            return;
        }

        let newPhoneNumber = phoneNumber;
        if (phoneNumber.charAt(0) === "0") {
            newPhoneNumber = phoneNumber.substring(1);
        }
        newPhoneNumber = "+964" + newPhoneNumber;
        let userExist = false;
        // check if a user with this phone number already exists in users collection
        let userDocs = await getDocs(query(usersCol, where("phoneNumber", "==", newPhoneNumber)));
        if (!userDocs.empty) {
            userExist = true;
        } else {
            let placeDocs = await getDocs(query(placesCol, where("phoneNumber", "==", newPhoneNumber)));
            if (!placeDocs.empty) {
                userExist = true;
            }
        }

        if (!userExist) {
            setError('هیچ هەژمارێک بەم ژمارە مۆبایلەوە پەیوەست نییە');
            return
        }

        let verify = new RecaptchaVerifier('recaptcha-container-1', {}, myauth);

        signInWithPhoneNumber(myauth, newPhoneNumber, verify).then((confirmationResult) => {
            setfinal(confirmationResult);
            notifications.showNotification({
                title: 'ئاگاداری',
                message: 'کۆدەکە نێردرا بۆ ژمارەکەت',
                autoClose: 4000,
            })
            setshow(true);
        })
            .catch((err) => {
                notifications.showNotification({
                    title: 'هەڵەیەک ڕوویدا',
                    message: err,
                    autoClose: false,
                    color: 'red',
                })

            });
    }

    const ValidateOtp = async () => {
        setError("");
        if (otp === null || final === null)
            return;
        try {
            await final!.confirm(otp);
        } catch (error) {
            notifications.showNotification({
                title: 'هەڵەیەک ڕوویدا',
                message: 'کۆدەکە هەڵەیە',
                autoClose: false,
                color: 'red',
            })
        }
    }
    if (loading) return null
    if (user) router.push((router.query.redirect || '/').toString());
    if (user) return <h1>سەرکەوتوو بوو</h1>

    return (
        <>
            <Head>
                <title>داخڵبوون</title>
            </Head>
            <div className="m-auto my-24 w-2/3 md:w-1/3 divide-y-4 space-y-1 h-[50vh]">
                <div>
                    <div id="recaptcha-container-1" className='m-2'></div>
                    <div style={{ display: !show ? "block" : "none" }} className='space-y-2'>
                        <Input
                            dir="ltr"
                            icon={<Phone />}
                            size='xl'
                            placeholder="07xxxxxxxxx"
                            maxLength={11}
                            value={phoneNumber}
                            onChange={(e: any) => setnumber(e.target.value)}
                        />
                        <br />
                        <Alert icon={<AlertCircle size={16} />} title="کێشەیەک ڕوویدا" color="red" className={(myerror == "" ? "hidden" : "")}>
                            <span>{myerror.toString()}</span>
                        </Alert>
                        <br className={(myerror == "" ? "hidden" : "")} />
                        <Button size="xl" radius="xl" onClick={signin} disabled={!((phoneNumber.length == 10 && phoneNumber.charAt(0) != '0') || phoneNumber.length == 11)} >
                            کۆد بنێرە بۆ ژمارەکەت
                        </Button>
                        <div>

                            <Link href='/signup' passHref>
                                <Button variant="subtle" radius="xl">
                                    هەژمارت نییە؟ هەژمار درووستبکە
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div style={{ display: show ? "block" : "none" }}>
                        <Input
                            dir="ltr"
                            icon={<Hash />}
                            size='xl'
                            placeholder="کۆدەکە داخڵ بکە"
                            value={otp}
                            onChange={(e: any) => setotp(e.target.value)}
                        />
                        <br />
                        <Alert icon={<AlertCircle size={16} />} title="کێشەیەک ڕوویدا" color="red" className={(myerror == "" ? "hidden" : "")}>
                            <span>{myerror.toString()}</span>
                        </Alert>
                        <br className={(myerror == "" ? "hidden" : "")} />
                        <Button size="xl" radius="xl" onClick={ValidateOtp} >
                            دڵنیاکردنەوە
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignIn
