import "./Loader.css";
export default function Loader({ message = "Loading..." }) {
  return (
    <main>
      <section className="flex justify-center flex-col items-center h-[calc(100vh-100px)]">
        <div className="loader one"></div>

        <p className="text-lg text-center text-gray-900 mt-4">{message}</p>
      </section>
    </main>
  );
}
