import Image from "next/image"

export const BackgrounImage = () => {
    return (
        <>
            <Image
                src="https://images.unsplash.com/photo-1508013861974-9f6347163ebe?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Background"
                fill
                priority
                style={{ objectFit: "cover" }}
            />
            <div className="absolute inset-0 bg-black/25"></div>
        </>
    )
}