function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

export const  fetchResourses = async () => {
    await sleep(2000);
    return ['sugestion1', 'sugestion2', 'sugestion3', 'sugestion4', 'sugestion5', 'sugestion6']
}