export function setStorage(key, data) {
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function getStorage(key) {
  if (!key) return;
  let res = localStorage.getItem(key);
  try {
    return JSON.parse(res);
  } catch (err) {
    return res;
  }
}

export function cleanStorage(key) {
  if (!key) return;
  localStorage.removeItem(key);
}

// 中国标准时间format yyyy-mm-dd
export const format = time => {
  let ymd = "";
  let mouth =
    time.getMonth() + 1 >= 10
      ? time.getMonth() + 1
      : "0" + (time.getMonth() + 1);
  let day = time.getDate() >= 10 ? time.getDate() : "0" + time.getDate();
  ymd += time.getFullYear() + "-"; // 获取年份。
  ymd += mouth + "-"; // 获取月份。
  ymd += day; // 获取日。
  return ymd; // 返回日期。
};

export const getAllDate = (start, end) => {
  let dateArr = [];
  let startArr = start.split("-");
  let endArr = end.split("-");
  let db = new Date();
  db.setUTCFullYear(startArr[0], startArr[1] - 1, startArr[2]);
  let de = new Date();
  de.setUTCFullYear(endArr[0], endArr[1] - 1, endArr[2]);
  let unixDb = db.getTime();
  let unixDe = de.getTime();
  let stamp;
  const oneDay = 24 * 60 * 60 * 1000;
  for (stamp = unixDb; stamp <= unixDe; ) {
    dateArr.push(format(new Date(parseInt(stamp))));
    stamp = stamp + oneDay;
  }
  return dateArr;
};

export const computeArr = arr => {
  let map = {},
    newArr = [];
  for (let i = 0; i < arr.length; i++) {
    let ai = arr[i];
    if (!map[ai.date]) {
      newArr.push({
        date: ai.date,
        count: ai.count
      });
      map[ai.date] = ai;
    } else {
      for (let j = 0; j < newArr.length; j++) {
        let dj = newArr[j];
        if (dj.date == ai.date) {
          dj.count = dj.count + ai.count;
          break;
        }
      }
    }
  }
  return newArr;
};

export function permission() {
  const role = getStorage("role").role || "";

  if (role !== "admin") {
    return true;
  }
}
