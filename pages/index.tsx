import { useRouter } from "next/router";
import { useRef, KeyboardEvent, ClipboardEvent, FormEvent } from "react";

export default function home() {
  return (
    <Home />
  )
}


const Home = () => {
  const router = useRouter();
  const myRefs = useRef<HTMLInputElement[]>([]);
  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>, i: number) => {
    console.log(e.key)
    if (e?.key == 'Backspace') {
      !myRefs?.current[i].value && myRefs.current[i == 0 ? 0 : i - 1]?.focus()
    } else {
      myRefs?.current[i].value && myRefs.current[i == 6 ? 6 : i + 1]?.focus()
    }
    if (myRefs.current[i].value) {
      myRefs.current[i].style.border = ''
    }
  };

  //hanlde when user enter ctrl+v
  const paste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData("text/plain")

    //check if the  value user pasted is numeric and 6 digit or not
    if (isNaN(parseInt(pasted))) {
      alert('invalid token !! token must be 6digit number')
      return
    }
    const token: string[] = pasted.split('')
    myRefs.current.map((c, i) => {
      token[i] ? c.value = token[i] : '';
    })
  }
  //trigger when user click submit button
  const submit = (e: FormEvent) => {
    e.preventDefault() //prevent from page refesh
    let token: string[] = [];
    for (let current of myRefs.current) {
      //validation 
      if (!current.value || current.value == undefined) {
        current.style.border = "2px solid red"
        return
      } else {
        current.style.border = ''
      }
      token.push(current.value)
    }

    //api request to backend in our case is next js powered express js backend under api/verify folder
    fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: token.join(''),
    })
      .then(async (res) => res.ok ? res.json() : Promise.reject(res.json()))
      .then((res: any) => { alert(res?.message); router.push('/success') })// for success 
      //for error
      .catch(async (c) => {
        const { error } = await c;
        alert(error)
      }
      )
  }
  return (
    <div className="bg-white min-h-screen flex justify-center items-center">
      <div className="text-center w-[20%]">
        <h1 className="font-bold text-lg">Verification Code:</h1>
        <form onSubmit={submit}>
          <div className="grid grid-cols-6 gap-1 my-3">
            {
              Array(6).fill(0).map((_, i) => {
                return (
                  <input
                    title={`${i}`}
                    name={`${i}`}
                    //event when user press keyboard button
                    onKeyUp={(e) =>
                      handleKeyUp(e, i)
                    }
                    // event when user paste 
                    onPaste={paste}
                    //event when input change
                    onChange={(e) => {
                      //digit validation replace with empty value '' when aphabet and special character enter
                      e.target.value = e.target.value.replace(/^[a-zA-Z\s\W]+$/, '').substring(0, 1);
                    }
                    }
                    //assigning ref to the rect userref similar to document.getElementbyId()
                    ref={(el) => {
                      myRefs.current[i] = el as HTMLInputElement
                    }}
                    min={0} max={9} maxLength={1} key={i} type="text" className="border-2 border-gray-800 rounded-md px-3.5 p-1.5" />
                )
              })
            }
          </div>
          <button type="submit" className="bg-purple-950 w-[80%] text-white p-2 text-lg rounded-md ">
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}