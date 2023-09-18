

type SinglePlayerProps = {
    avatar: string;
    name: string;
};

const SinglePlayer = ({ avatar, name }: SinglePlayerProps): JSX.Element => (
    <div className="flex flex-col items-center space-y-2">
        <img src={avatar} alt={name} className="rounded-full w-16 h-16" />
        <span className="text-lg">{name}</span>
    </div>
);

export default SinglePlayer;
