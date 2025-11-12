import Image from "next/image"
import Link from "next/link"

const BlockCard = () => {
    return (
        <div className="Card">
            <Image
                src=""
                alt=""
                width={100}
                height={10}
            />
            <p className="card-map">
                <span className="card-country"></span>,
                <span className="card-country-city"></span>
            </p>
            <div className="card-category">
                <ul>
                    <li></li>
                </ul>
            </div>
            <div className="stars"></div>
            <div className="buttons"> 
                <Link href="/cards/id: "><button>Learn More</button></Link>
                <Link href=""><button>Compare</button></Link>
            </div>
        </div>
    )
}
export default BlockCard