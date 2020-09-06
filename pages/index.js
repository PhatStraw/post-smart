export default function Home() {
  const onClick = async() => {
    const data = await fetch('http://localhost:3000/api/controllers')
    const newdata = await data.json()
    console.log('new DATA',newdata)
  }
  return (
    <div>
      <h1>hello</h1>
      <button onClick={onClick}>Hello</button>
    </div>
  )
}
