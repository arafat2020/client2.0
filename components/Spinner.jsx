import React from 'react';
import Image from 'next/image'

const Spinner = ({width=200,vh=false}) => {
	return (
		<div className={`spinner ${vh && 'vh'}`} >
			<Image className='img'  width={width} height={100} src='/805.svg' alt='image'/>
		</div>
	);
};

export default Spinner;