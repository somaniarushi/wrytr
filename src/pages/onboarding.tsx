import Image from 'next/image'
// Import a serif font
import { IBM_Plex_Serif, JetBrains_Mono } from 'next/font/google';
import { redirect } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react'
import { use, useEffect, useState } from 'react';
import { createUser, getUser, updateUser, getUserByUsername } from '../lib/utils';
import Typewriter from "typewriter-effect";
import Head from 'next/head'

const font = IBM_Plex_Serif({ weight: '400', subsets: ['latin'] })
const jbm = JetBrains_Mono({ weight: '400', subsets: ['latin'] })

const PageHeader = () => {
  return (
    <Head>
      <title>The Wrytr: Onboarding</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="og:image" content="/favicon.ico" />
      <meta name="description" content="Personalized micro-blogging service" />
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
              strings: ['Making your account', 'Creating space', 'Imagining futures'],
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

export default function Onboarding() {
  // If the user is not signed in, surface a sign in button. If a user is signed in, surface the title of the webpage
  const { data: session } = useSession()
  const [user, setUser]: [any, any] = useState(null)
  const [username, setUsername]: [any, any] = useState(null)
  const [clashError, isClashError]: [any, any] = useState(false)
  const [loading, setLoading]: [any, any]= useState(false)


  useEffect(() => {
    const callback = async () => {
      if (session && session.user && session.user.email && session.user.name) {
        const res = await getUser(session.user.email);
        if (res.statusCode === 401) {
          const newUser = await createUser(session.user.email, session.user.name)
          setUser(newUser);
          return;
        } else {
          if (res.user.username) {
            window.location.href = `/${res.user.username}`
          }
          setUser(user);
        }
      }
    }
    callback()
  });

  if (loading) {
    return (<LoadingScreen />)
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen py-2 ${font.className}`}>
      <PageHeader />
      {/* Put log out in top right corner */}
      {/* <button
        onClick={() => {
          window.location.href = "/"
          signOut()
          window.location.reload()
        }}
        className={`text-sm absolute top-0 right-0 border-2 border-gray-700 rounded-lg p-2 m-2 w-20 hover:bg-gray-700 hover:text-gray-100 ${font.className}`}
      >
        Sign Out
      </button> */}
      <h1 className="text-4xl font-bold text-center text-gray-900 pb-8">
        Set a username!
      </h1>
      <p className="font-bold text-center text-gray-900 pb-8">
        This will be your URL to your blog.
        You can{"'"}t easily change it again, so choose wisely!
      </p>
      <input className="text-4xl font-bold text-center text-gray-900 border-2 mb-4 p-2" type="text" onChange={(e) => setUsername(e.target.value)}></input>
      <button onClick={async () => {
        isClashError(false);
        if (session && session?.user?.email && username) {
          const checkUserNameExists = await getUserByUsername(username);
          if (checkUserNameExists.statusCode === 200) {
            isClashError(true);
            return;
          }
          setLoading(true);
          const res = await getUser(session.user.email);
          if (!res.user.username) {
            updateUser(session.user.email, username)
          }
        }
      }
      }>Submit</button>
      {
        clashError &&
          <p className={`text-sm text-gray-500 p-1 mt-8 ${jbm.className} bg-red-100 rounded-lg`}
          >That username is already in use. Please pick another one.</p>
      }
    </div>
  )
}