import Image from "next/image";

export default function Banner() {
    return (
        <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
                {/* Left content */}
                <div className="max-w-xl">
                    <h1 className="text-5xl font-bold tracking-tight">
                        Match with a{' '}
                        <span className="text-blue-600">Collaborating</span>
                        {' '}Physician
                    </h1>
                    <div className="mt-4">
                        <div className="inline-block border-2 border-emerald-400 px-4 py-1 text-2xl text-emerald-500">
                            Instantly
                        </div>
                    </div>
                    <p className="mt-6 text-gray-600 text-lg">
                        Let Doctors compete for your Nurse Practitioner collaboration requirement.
                    </p>
                    <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors">
                        Match with an MD Now →
                    </button>
                </div>

                {/* Right image */}
                <div className="relative">
                    <div className="absolute -z-10 w-72 h-72 rounded-full bg-emerald-100 -top-10 -right-10" />
                    <div className="absolute -z-10 w-32 h-32 rounded-full bg-orange-100 -bottom-6 -left-6" />
                    <div className="relative bg-blue-600 rounded-lg p-1">
                        <Image src="/doctor-image.png" alt="Professional Medical Doctor" width={0} height={0} sizes="100vw" className="w-auto h-auto w-[400px] rounded-lg" />
                    </div>
                    <div className="absolute -z-10 top-1/2 right-0 transform translate-x-1/2">
                        <span className="text-4xl">✷</span>
                    </div>
                </div>
            </div>
        </div>
    );
}