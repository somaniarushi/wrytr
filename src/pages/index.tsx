import Image from 'next/image'
// Import a serif font
import { IBM_Plex_Serif, JetBrains_Mono } from 'next/font/google';
import { redirect } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react';
import Typewriter from "typewriter-effect";
import Head from 'next/head'

const font = IBM_Plex_Serif({ weight: '400', subsets: ['latin'] })
const jbm = JetBrains_Mono({ weight: "400", subsets: ["latin"], display: "swap" })

const PageHeader = () => {
  return (
    <Head>
      <title>The Wrytr</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="description" content="Personalized micro-blogging service" />
      {/* Add favicon as image */}
      <meta name="og:image" content="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
    </Head>
  )
}

const LoadingScreen = () => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen py-2 p-24 ${font.className}`}>
      <PageHeader />
      <h1 className="text-4xl font-bold text-center pb-8">
        <Typewriter
          options={{
            strings: ['The Wrytr'],
            autoStart: true,
            loop: true,
            delay: 50,
          }}
        />
      </h1>
      {/* Loading symbol */}
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
    </div>
  )
}

export default function Home() {
  // If the user is not signed in, surface a sign in button. If a user is signed in, surface the title of the webpage
  const { data: session } = useSession()
  const [user, setUser]: [any, any] = useState(null)

  const getUser = async (email: String) => {
    // Foward email to the api, setting query as email
    const res = await fetch(`/api/getUser?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const json = await res.json()
    return json
  }

  const createUser = async (email: String, name: String) => {
    // Foward email to the api, setting query as email
    const res = await fetch(`/api/createUser?email=${email}&name=${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const json = await res.json()
    return json
  }

  useEffect(() => {
    const callback = async () => {
      if (session && session.user && session.user.email && session.user.name) {
        const res = await getUser(session.user.email);
        if (res.statusCode === 401) {
          const createdres = await createUser(session.user.email, session.user.name)
          setUser(createdres.user);
          return
        } else {
          setUser(res.user);
        }
      }
    }
    callback()
  })

  if (session && !user) {
    // Loading
    return <LoadingScreen />
  }


  // If someone's logged in and there is a user, redirect to their profile
  // If they haven't set up their username yet, redirect to onboarding
  if (session?.user && user) {
    if (user && user?.username) {
      window.location.href = `/${user.username}`
      return <LoadingScreen />
    }
    else {
      window.location.href = '/onboarding'
      return <LoadingScreen />
    }
  }

  return (
    <>
      <PageHeader />
      <div className={`flex flex-col items-center justify-center min-h-screen py-2 p-16 md:p-24 ${font.className}`}>
        <h1 className="text-6xl font-bold text-center pb-8">
          <Typewriter
            options={{
              strings: ['The Wrytr'],
              autoStart: true,
              loop: true,
            }}
          />
        </h1>
        <p className="text-2xl font-bold text-center pb-8">
          Your personal micro-blogging platform.
        </p>
        <p className="font-bold pb-8 md:w-1/2">
          The micro-blog was invented for people to be able to share their thoughts easily.
          We bring that simplicity back.
          Set up your Wrytr page, and start writing.
          Go to other{"'"}s pages, and start reading.
          <br /> <br />
          <span>That{"'"}s it. Really.</span>
        </p>
        <button
          onClick={() => signIn()}
          className={`text-sm bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded`}>
          Sign Up or Sign In
        </button>
      </div>
    </>
  )
}