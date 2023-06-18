const getUser = async (email: String) => {
  // Foward email to the api, setting query as email
  const res = await fetch(`/api/getUser?email=${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await res.json();
  return json;
};

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

const updateUser = async (email: String, username: String) => {
  // Foward email to the api, setting query as email
  const res = await fetch(`/api/setUsername?email=${email}&username=${username}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  const json = await res.json()
  return json
}

const getNotes = async (username: String) => {
  const res = await fetch(`/api/getNotes?username=${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await res.json();
  return json;
};

const createNote = async (
  title: String,
  description: String,
  email: String
) => {
  const res = await fetch(
    `/api/createNote?title=${title}&description=${description}&email=${email}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const json = await res.json();
  return json;
};

const getUserByUsername = async (username: String) => {
  const res = await fetch(`/api/getUserByUsername?username=${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await res.json();
  return json;
};

export { getUser, getNotes, createNote, createUser, updateUser, getUserByUsername };
