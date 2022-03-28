import type { NextPage } from 'next'
import Head from 'next/head'
import { getAuth, ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useEffect, useState } from 'react'
import { useAuth } from '../lib/firebase/firebaseAuthProvider'
import { useRouter } from 'next/router';
import { getDocs, query, where, doc, setDoc } from "firebase/firestore";
import { placesCol, usersCol } from '../lib/firebase/firestore/db';
// import { User } from '../lib/types/user';
import { useNotifications } from '@mantine/notifications';
import { Button, Card, Center, Grid, Text, Group, Input, Alert, Select } from '@mantine/core';
import { AlertCircle, BuildingStore, Hash, Phone, User as UserIcon } from 'tabler-icons-react';
import { Place } from '../lib/firebase/firestore/types/place';
import { User } from '../lib/firebase/firestore/types/user';

enum Step {
  choosingAccountType,
  enteringPhoneNumber,
  enteringData,
  verifyOtp,
}

enum AccountType {
  user,
  place,
}

const Home: NextPage = () => {
  const { user, loading } = useAuth()
  const router = useRouter();
  const notifications = useNotifications();
  const [newUser, setNewUser] = useState({} as User);
  const [newPlace, setNewPlace] = useState({} as Place);
  const [type, setType] = useState(AccountType.user);
  const [step, setStep] = useState(Step.choosingAccountType);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [myerror, setError] = useState("");
  const [otp, setotp] = useState('');
  const [final, setfinal] = useState<ConfirmationResult>();

  const myauth = getAuth()

  useEffect(() => {
    if (user) router.push((router.query.redirect || '/').toString());
  }, [router, user]);

  const checkPhoneNumber = async () => {
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
    setPhoneNumber(newPhoneNumber);
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

    if (userExist) {
      setError('هەژمار هەیە بەم ژمارەیەوە');
      return
    } else {
      setStep(Step.enteringData);
    }
  }
  const signUpUser = () => {
    setError('');
    if (newUser.name === "" && newUser.name.length < 4) {
      setError('ناوی دروست بەکاربێنە');
      return;
    }

    let verify = new RecaptchaVerifier('recaptcha-container', {}, myauth);


    signInWithPhoneNumber(myauth, phoneNumber, verify).then((confirmationResult) => {
      setfinal(confirmationResult);
      notifications.showNotification({
        title: 'ئاگاداری',
        message: 'کۆدەکە نێردرا بۆ ژمارەکەت',
        autoClose: 4000,
      })

      setStep(Step.verifyOtp);

    })
      .catch((err) => {
        notifications.showNotification({
          title: 'هەڵەیەک ڕوویدا',
          message: err,
          autoClose: false,
          color: 'red'
        })
      });
  }
  const signUpPlace = async () => {
    setError('');
    if (newPlace.name === "" && newPlace.name.length < 4) {
      setError('ناوی دروست بەکاربێنە');
      return;
    }
    if (newPlace.city === "") {
      setError('شارێک هەڵبژێرە');
      return;
    }
    if (newPlace.district === "") {
      setError('ناوی گەڕەکێک بنووسە');
      return;
    }


    let verify = new RecaptchaVerifier('recaptcha-container', {}, myauth);
    let pictureUrl = 'https://pbs.twimg.com/media/FOzJa0KWQAYWTGw.jpg';
    let loca = {
      latitude: 35.56646543254848,
      longitude: 45.43715259751288
    };
    setNewPlace({ ...newPlace, photoUrl: pictureUrl, location: loca });

    signInWithPhoneNumber(myauth, phoneNumber, verify).then((confirmationResult) => {
      setfinal(confirmationResult);
      notifications.showNotification({
        title: 'ئاگاداری',
        message: 'کۆدەکە نێردرا بۆ ژمارەکەت',
        autoClose: 4000,
      })

      setStep(Step.verifyOtp);

    })
      .catch((err) => {
        notifications.showNotification({
          title: 'هەڵەیەک ڕوویدا',
          message: err,
          autoClose: false,
          color: 'red'
        })
      });
  }
  const ValidateOtp = () => {
    setError("");

    if (otp === null || final === null)
      return;

    final!.confirm(otp).then(async (result) => {
      try {
        switch (type) {
          case AccountType.user:
            const userRef = doc(usersCol, result.user.uid)
            await setDoc(userRef, { ...newUser, id: result.user.uid, phoneNumber: phoneNumber });
            break;
          case AccountType.place:
            const placeRef = doc(placesCol, result.user.uid)
            await setDoc(placeRef, { ...newPlace, id: result.user.uid, phoneNumber: phoneNumber });
            break;
        }
      } catch (e: any) {
        setError(e.toString());
        notifications.showNotification({
          title: 'هەڵەیەک ڕوویدا',
          message: e,
          autoClose: false,
          color: 'red'
        })
      }
    }).catch((_) => {
      setError("کۆدەکە هەڵەیە");
      notifications.showNotification({
        title: 'هەڵەیەک ڕوویدا',
        message: "کۆدەکە هەڵەیە",
        autoClose: false,
        color: 'red'
      })
    })
  }
  if (loading) return null
  if (user) router.push((router.query.redirect || '/').toString());
  if (user) return <h1>سەرکەوتوو بوو</h1>

  const project = () => {
    switch (step) {
      case Step.choosingAccountType:
        return <div className='h-[83vh] flex flex-col items-center justify-center'>
          <Center>
            <h1 className='p-10'>جۆری هەژمار هەڵبژێرە</h1>
          </Center>
          <Grid className='pb-20'>
            <Grid.Col span={6}>
              <Card>
                <div className='flex flex-col items-center'>
                  <UserIcon size={150} className='grow mx-20' />
                  <br />
                  <Button size='xl' onClick={() => {
                    setType(AccountType.user);
                    setStep(Step.enteringPhoneNumber)
                  }}>بەکارهێنەر</Button>
                </div>
              </Card>
            </Grid.Col>
            <Grid.Col span={6}>
              <Card >
                <div className='flex flex-col items-center'>
                  <BuildingStore size={150} className='grow mx-20' />
                  <br />
                  <Button size='xl' onClick={() => {
                    setType(AccountType.place);
                    setStep(Step.enteringPhoneNumber)
                  }}>شوێن</Button>
                </div>
              </Card>
            </Grid.Col>
          </Grid>
        </ div>;
      case Step.enteringPhoneNumber:
        return <div className="flex flex-col items-center justify-center h-[83vh] space-y-2">
          <h1>{type == AccountType.place ? 'شوێن' : 'بەکارهێنەر'}</h1>
          <br />
          <Input
            dir="ltr"
            icon={<Phone />}
            size='xl'
            placeholder="07xxxxxxxxx"
            maxLength={11}
            value={phoneNumber}
            onChange={(e: any) => setPhoneNumber(e.target.value)}
          />

          <br />
          <Alert icon={<AlertCircle size={16} />} title="کێشەیەک ڕوویدا" color="red" className={(myerror == "" ? "hidden" : "")}>
            <span>{myerror.toString()}</span>
          </Alert>
          <br className={(myerror == "" ? "hidden" : "")} />
          <Button size="xl" radius="xl" onClick={checkPhoneNumber} disabled={!((phoneNumber.length == 10 && phoneNumber.charAt(0) != '0') || phoneNumber.length == 11)} >
            دواتر
          </Button>
        </div>;
      case Step.enteringData:
        switch (type) {
          case AccountType.place:
            return <div className="flex flex-col items-center justify-center h-[83vh] space-y-2">
              <h1>شوێن</h1>
              <Card dir='ltr'>
                {phoneNumber}
              </Card>
              <br />
              <div className='space-y-2'>
                <Input
                  icon={<BuildingStore />} size='xl' placeholder="ناوی شوێن" value={newPlace.name}
                  onChange={(e: any) => setNewPlace({ ...newPlace, name: e.target.value })}
                />
                <Select
                  // label="شار"
                  placeholder="یەکێک هەڵبژێرە"
                  data={[
                    { value: 'سلێمانی', label: 'سلێمانی' },
                    { value: 'هەولێر', label: 'هەولێر' },
                    { value: 'دهۆک', label: 'دهۆک' },
                    { value: 'کەرکوک', label: 'کەرکوک' },
                  ]}
                  value={newPlace.city}
                  onChange={(e: any) => { setNewPlace({ ...newPlace, city: e }) }}
                />
                <Input
                  icon={<BuildingStore />} size='xl' placeholder="ناوی گەڕەک" value={newPlace.district}
                  onChange={(e: any) => setNewPlace({ ...newPlace, district: e.target.value })}
                />


                {/* <select className="select w-full max-w-xs select-bordered" onChange={(e) => jobType = e.target.value}>
                  <option disabled selected>جۆری کار</option>
                  <option>فڕۆشگا</option>
                  <option>خواردنگە</option>
                  <option>نانەوا خانە</option>
                  <option>شیرەمەنی</option>
                  <option>چای خانە</option>
                  <option>کافتریا</option>
                  <option>شیرینی خانە</option>
                  <option>قاوە خانە</option>
                  <option>دەرمانخانە</option>
                  <option>نەخۆش خانە</option>
                  <option>سەرتاش خانە</option>
                  <option>وەرشە</option>
                  <option>مەلەوانگە</option>
                  <option>یاریگای وەرزشی</option>
                  <option>هۆڵی وەرزشی</option>
                  <option>گەراج</option>
                  <option>مۆڵ</option>
                  <option>نەوجەوانان</option>
                  <option>خەڵووەتگەی پیری</option>
                  <option>دەزگای خێرخوازی</option>
                </select> */}

                <br />
              </div>
              <div id="recaptcha-container" className='m-4'></div>
              <br />
              <Alert icon={<AlertCircle size={16} />} title="کێشەیەک ڕوویدا" color="red" className={(myerror == "" ? "hidden" : "")}>
                <span>{myerror.toString()}</span>
              </Alert>
              <br className={(myerror == "" ? "hidden" : "")} />
              <Button size="xl" radius="xl" onClick={signUpPlace} >
                دواتر
              </Button>
            </div>;
          case AccountType.user:
            return <div className="flex flex-col items-center justify-center h-[83vh] space-y-2">
              <h1>بەکارهێنەر</h1>
              <Card dir='ltr'>
                {phoneNumber}
              </Card>
              <br />
              <Input
                icon={<UserIcon />}
                size='xl'
                placeholder="ناوی بەکارهێنەر"
                minLength={4}
                onChange={(e: any) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <div id="recaptcha-container" className='m-4'></div>

              <br />
              <Alert icon={<AlertCircle size={16} />} title="کێشەیەک ڕوویدا" color="red" className={(myerror == "" ? "hidden" : "")}>
                <span>{myerror.toString()}</span>
              </Alert>
              <br className={(myerror == "" ? "hidden" : "")} />

              <Button size="xl" radius="xl" onClick={signUpUser}>
                کۆد بنێرە بۆ ژمارەکەت
              </Button>
            </div>;
        }
      case Step.verifyOtp:
        return <div className='h-[83vh] flex flex-col items-center justify-center'>
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
        </div>;
    }
  }

  return (
    <>
      <Head>
        <title>داخڵبوون</title>
      </Head>
      {project()}
    </>
  )
}

export default Home
