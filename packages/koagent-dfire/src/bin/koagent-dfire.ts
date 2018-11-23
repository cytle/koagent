import debug from 'debug';
import program from 'commander';
import koagentDifre from '..';

program
  .version('0.1.0')
  .option('-p, --porxy-port', '代理端口', 30000)
  .option('--manager-port', '管理端口', 30001)
  .option('--debug', '开启debug，打印更多日志', false)
  .parse(process.argv);

if (program.debug) {
  console.log('debug');
  debug.enable('*');
}

koagentDifre({
  managerPort: program.managerPort,
  proxyPort: program.porxyPort,
}).then(() => {
  console.log(`manager: http://localhost:${program.managerPort}`);
  console.log(`proxy: http://localhost:${program.porxyPort}`);
}, (error) => {
  console.error(error);
});
