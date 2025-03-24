import { Link } from "react-router-dom"

export const Home = () => {
    return <>
        <p>Home Page</p>
        <Link to="/about">
            <button>About</button>
        </Link>

    </>
}