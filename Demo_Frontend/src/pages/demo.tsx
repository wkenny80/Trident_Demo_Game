import { FC, useRef, useState, useEffect } from 'react'
import { APP_NAME } from '@/lib/consts'
import { motion, AnimatePresence } from 'framer-motion';
import DemoSection from '@/components/sections/DemoSection';
import Footer from '@/components/sections/FooterSection';

// @ts-ignore
import desktopBG from '@images/desktop-bg.apng';

const Demo: FC = () => {
	return (
		<div>
			<div style={{"backgroundImage": "url(images/stone-tiles.png)"}} className="w-screen min-h-screen h-auto bg-gradient-to-b from-transparent to-black">
				<DemoSection />
			</div>
			<Footer />
		</div>
	)
}

export default Demo
