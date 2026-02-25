type Props = {
  name: string;
  uncompletedCount : number
};

const WelcomeMessage = (props: Props) => {
  const greeting ="おはこんばんにちは";

  return (
    <div className="text-blue-700 text-center text-2xl">
      {greeting}、{props.name}さん。今日も成長を楽しもう!。
    </div>
  );
};

export default WelcomeMessage;