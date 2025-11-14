import Image from "next/image"
export default function CardProfile(){
    return(
        <>
        <section>
            <div>
                <Image src="" alt="" />
                <Image src="" alt="" />
                <Image src="" alt="" />
            </div>
            <div>
                <h1>
                    Name
                </h1>
                <div><span>Country</span>, <span>City</span></div>
                <div className="categorys">
                    <ul>
                        <li></li>
                    </ul>
                </div>
            </div>
        </section>
        <section>
            <h2>About `name`</h2>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequuntur ea expedita laborum? Quo autem, officiis eveniet totam consequatur id quibusdam doloribus ad sapiente debitis eos in, voluptatem minus ab mollitia!</p>
        </section>
        <section>
            <h2>Contact us</h2>
            <div>phone</div>
            <div>email</div>
            <div>address</div>
            <div>Map</div>
        </section>
        </>
    )
}