import { defineStore } from 'pinia';
import {
  addDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db, membersColl } from '@/firebase/config';
import arraySort from 'array-sort';
import type { AddStudentParams, MemberPosition, TeacherRole } from '@/types';
import type { AccountData } from '@/types/store';

interface DefaultPayload
  extends AddStudentParams,
    Pick<AccountData, 'church' | 'department'> {
  position: MemberPosition;
}

export const useMemberStore = defineStore('member', {
  state: () => {
    return {};
  },
  actions: {
    async createMember(payload: DefaultPayload) {
      const { church, department, position, ...memberInfo } = payload;

      const q = query(
        membersColl,
        where('church', '==', church),
        where('department', '==', department),
        where('position', '==', position)
      );
      const querySnapshot = await getDocs(q);

      // 추가 등록
      if (querySnapshot.docs.length) {
        const docId = querySnapshot.docs[0].id;
        const docData = querySnapshot.docs[0].data();
        docData.members.push(memberInfo);

        return await setDoc(doc(db, 'members', docId), docData);
      }
      // 처음 등록
      else {
        const params = {
          church,
          createdAt: serverTimestamp(),
          department,
          members: [memberInfo],
          position,
        };
        return await addDoc(membersColl, params);
      }
    },

    async modifyMember(payload: any) {
      const q = query(
        membersColl,
        where('church', '==', payload.church),
        where('department', '==', payload.department),
        where('position', '==', payload.position)
      );

      const querySnapshot = await getDocs(q);

      console.log(querySnapshot.docs[0].id);
      console.log(querySnapshot.docs[0].data());

      /**
       * TODO : 20220809
       * 어떻게 해야지 수정이 매끄럽게 될까?
       * 뭔가 지금은 index를 가져와서 바꿔줘야하지 않을까 싶다.
       */
    },

    // async fetchMembers(payload: Omit<DefaultPayload, keyof State>) {
    async fetchMembers(payload: {
      church: string | undefined;
      department: string | undefined;
      grade?: string;
      group?: string;
      position: MemberPosition;
      role?: TeacherRole;
    }) {
      try {
        const { church, department, grade, group, position, role } = payload;

        const q = query(
          membersColl,
          where('church', '==', church),
          where('department', '==', department),
          where('position', '==', position)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length) {
          let members = querySnapshot.docs[0].data().members;

          if (role === 'admin') {
            // pass
          } else if (role === 'main') {
            /** TODO : any 타입 정리하기 */
            members = members.filter(
              (member: any) => member.grade === grade && member.group === group
            );
          }
          return arraySort(members, ['grade', 'group', 'name']);
        } else {
          return [];
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
});
