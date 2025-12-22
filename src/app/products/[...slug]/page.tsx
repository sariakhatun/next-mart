
const CatchAllRoute =async ({params}: {params: Promise<{slug: string}>}) => {
    console.log(await params)
    return (
        <div>
            <h1>Catch All Route </h1>
        </div>
    );
};

export default CatchAllRoute;