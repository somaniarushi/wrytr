import Image from "next/image";
import { IBM_Plex_Serif, JetBrains_Mono } from "next/font/google";
import { redirect } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Input } from "postcss";
import { getNotes, getUser, createNote } from "../lib/utils";
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';

const font = IBM_Plex_Serif({ weight: "400", subsets: ["latin"] });
const jbm = JetBrains_Mono({ weight: "400", subsets: ["latin"] })

const Loader = () => {
  return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
}

const InputBar = ({ user, username, slug, setNotes }: {
  user: any,
  username: any,
  slug: any,
  setNotes: any
}) => {
  const { data: session } = useSession()
  const [description, setDescription] = useState("");
  if (username !== slug) {
    return null;
  } else {
    return (
      <div className={`flex flex-col items-center font-bold ${font.className}`}>
        {/* Make the text box really wide and long */}
        <textarea
          className="border-2 border-gray-700 rounded-lg p-2 m-2 md:w-1/3 md:h-50 text-gray-700"
          placeholder="Write something"
          onChange={(e) => setDescription(e.target.value)} />
        {/* Make button as big as the text within it*/}
        <button
          className="border-2 border-gray-700 rounded-lg p-2 m-2 w-20 hover:bg-gray-700 hover:text-gray-100"
          onClick={async () => {
            await createNote("", description, user.email);
            // Reload the component
            const res = await getNotes(slug as string);
            setNotes(res.notes);
          }}>+</button>
      </div>

    )
  }
}

export default function NotesDisplay() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);

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
          setNotes(res.notes);
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
    <div className={`${font.className} p-14`}>
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
            className={`text-sm absolute top-0 right-0 border-2 border-gray-700 rounded-lg p-2 m-2 w-20 hover:bg-gray-700 hover:text-gray-100 ${font.className}`}
          >
            Sign Out
          </button>
        }
      </div>
      <h1 className="text-6xl font-bold pb-8 text-center">
        <span className="special">{slug}</span>{"'s"} notes
      </h1>
      {
        session && !user
          ? (<Loader />)
          : (
            user && user?.username && slug === user?.username &&
            <InputBar user={user} username={user?.username} slug={slug} setNotes={setNotes} />
          )
      }
      <div className="pt-8">
        {
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
    <p className="pl-5 md:pl-0 md:text-sm md:w-1/2">
      <ReactMarkdown>{description}</ReactMarkdown>
    </p>
  </div>
);
