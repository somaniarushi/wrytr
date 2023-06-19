import Image from "next/image";
import { IBM_Plex_Serif, JetBrains_Mono } from "next/font/google";
import { redirect } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Input } from "postcss";
import { getNotes, getUser, createNote } from "../lib/utils";
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import Head from "next/head";

const font = JetBrains_Mono({ weight: "400", subsets: ["latin"] })
const jbm = JetBrains_Mono({ weight: "400", subsets: ["latin"] })

const PageHeader = () => {
  return (
    <Head>
      <title>The Wrytr: Notes</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="description" content="Personalized micro-blogging service" />
      <meta name="og:image" content="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
    </Head>
  )
}

const Loader = () => {
  return (
  <>
    <PageHeader />
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </>
  )
}

// The input bar is a full screen modal
const InputBar = ({ user, username, slug, setNotes, setModalIsOpen }: {
  user: any,
  username: any,
  slug: any,
  setNotes: any,
  setModalIsOpen: any
}) => {
  const { data: session } = useSession()
  const [description, setDescription]: [any, any] = useState("");
  if (username !== slug) {
    return null;
  } else {
    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay, clickable to close modal */}
          <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => {
            setModalIsOpen(false);
          }}>
            <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
          </div>
          {/* Centered modal content */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          {/* Modal panel, show when screen is small */}
          <div className="inline-block align-bottom bg-gray-300 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <input type="text" placeholder="Enter your note here" className="p-4 w-full bg-gray-300  outline-none"
            onChange={(e) => {
              setDescription(e.target.value);
            }} />
            {/* Center button */}
            <button className="border-2 border-gray-700 rounded-lg p-1 m-2 w-20 hover:bg-gray-700"
            onClick={async () => {
            await createNote("", description, user.email);
            // Reload the component
            const res = await getNotes(slug as string);
            setNotes(res.notes.reverse());
          }}>+</button>
          </div>
        </div>
      </div>
    )
  }
}

export default function NotesDisplay() {
  const { data: session } = useSession();
  const [notes, setNotes]: [any, any] = useState(null);
  const [user, setUser]: [any, any] = useState(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    const callback = async () => {
      if (slug) {
        console.log(slug)
        const res = await getNotes(slug as string);
        if (res.statusCode === 401) {
          window.location.href = "/";
        } else {
          setNotes(res.notes.reverse());
        }
      }
    };
    callback();
  }, [slug]);

  useEffect(() => {
    const callback = async () => {
      if (session && session.user && session.user.email && session.user.name) {
        const res = await getUser(session.user.email);
        setUser(res.user);
      }
    };
    callback();
  });

  return (
    <div className={`${font.className} p-6 md:p-14`}>
      <PageHeader />
      <div className="flex flex-row pb-10">
        {/* Back to home button in top left corner */}
        <button onClick={() => {
          window.location.href = "/";
        }}
          className={`text-sm border-2 border-gray-700 rounded-lg p-2 m-2 w-20 hover:bg-gray-700 hover:text-gray-100 ${font.className} top-0 left-0 absolute`}
        >
          Home
        </button>
        {/* Put sign out button in top right corner */}
        {session &&
          <button
            onClick={() => {
              signOut()
            }}
            className={`text-sm absolute top-0 right-0 border-2 border-gray-700 rounded-lg p-2 m-2 w-25 hover:bg-gray-700 hover:text-gray-100 ${font.className}`}
          >
            Sign Out
          </button>
        }
      </div>
      {/* Decrease distance between letters */}
      <h1 className="md:text-5xl text-4xl font-bold pb-8 text-center tracking-tighter">
        <span className="special">{slug}</span>{"'s"} notes
      </h1>
      <div className="flex flex-row justify-center">
      {
        session && !user
          ? (<Loader />)
          :
          (
            user && user?.username && slug === user?.username && <button onClick={() => {
            setModalIsOpen(true);
          }}
            className={`text-sm border-2 border-gray-700 rounded-lg p-2 m-2 w-30 hover:bg-gray-700 hover:text-gray-100 ${font.className}`}
          > Create New
          </button>
          )
      }
      {modalIsOpen
        && <InputBar user={user} username={user?.username} slug={slug} setNotes={setNotes} setModalIsOpen={setModalIsOpen}/>
      }
      </div>
      <div className="pt-8">
        { notes === null
        ?<div className="flex flex-col items-center"> <Loader /></div>

        :
          notes.map((note: any) => {
            return (
              <NoteDisplay description={note.description} timestamp={note.createdAt} key={note._id} />
            )
          })
        }
      </div>
    </div>
  )
}

const NoteDisplay = ({ description, timestamp }: {
  description: string, timestamp: string
}) => (
  <div
    className={`flex flex-col md:flex-row md:items-center pb-8 ${jbm.className}`}
  >
    <p className="text-sm pr-8 pl-5 text-gray-400 text-2sm">
      {
        // Display date and time in a readable format, use zero padding
        // All dates should be the same length
        new Date(timestamp).toLocaleString("en-US", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      }
    </p>
    <div className="pl-5 md:pl-0 text-sm md:w-1/2">
      <ReactMarkdown>{description}</ReactMarkdown>
    </div>
  </div>
);
