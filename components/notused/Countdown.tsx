interface CountdownProps {
    seconds: number;
}

const Countdown: React.FC<CountdownProps> = ({ seconds }) => {
    console.log('countdown');
    return <>{seconds}</>;
}

export default Countdown;