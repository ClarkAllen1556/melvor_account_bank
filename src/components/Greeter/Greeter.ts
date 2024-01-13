export interface GreeterProps {
  name: string;
}

interface Greeter {
  props: GreeterProps;
  date: string
}

export default function Greeter(props: GreeterProps): Component<Greeter> {
  return {
    $template: '#mbts__greeter_x',
    props,
    date: new Date().toLocaleDateString()
  };
}
