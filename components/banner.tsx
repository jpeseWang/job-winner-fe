import React from 'react'

export default function Banner({ title }: { title: string }) {
    return (
        <section className="bg-black text-white py-16">
            <div className="container mx-auto text-center">
                <h1 className="text-4xl font-bold mb-4">{title}</h1>
            </div>
        </section>
    )
}
