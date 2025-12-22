
const ProductDetails =async ({
    params
    }:{
    params: Promise<{ id: string }>}) => {
    console.log(await params);
    const {id}=await params;
    return (
        <div>
            <h1>product details : {id} </h1>
        </div>
    );
};

export default ProductDetails;