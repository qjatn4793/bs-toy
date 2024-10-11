package com.example.demo.room.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.demo.room.entity.Reservation;
import com.example.demo.room.entity.Room;
import com.example.demo.room.repository.ReservationRepository;
import com.example.demo.room.repository.RoomRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class ReservationService {

	private final RoomRepository roomRepository;
	private final ReservationRepository reservationRepository;

    public boolean reserveRoom(Long roomId, Reservation reservation) {
        Optional<Room> room = roomRepository.findById(roomId);
        if (room.isPresent()) {
        	// 중복 예약 확인 로직 추가
            if (isOverlappingReservation(roomId, reservation.getStartDate(), reservation.getEndDate())) {
                return false; // 중복된 예약이 있는 경우 예약 실패
            }
        	
            reservation.setRoom(room.get());
            reservation.setReservationDate(LocalDateTime.now());
            reservationRepository.save(reservation); // 예약 저장
            return true;
        } else {
            return false; // 방을 찾지 못한 경우
        }
    }
    
    public List<LocalDate> getAvailableDates(Long roomId) {
        List<Reservation> reservations = reservationRepository.findByRoomId(roomId);
        List<LocalDate> availableDates = new ArrayList<>();

        // 오늘부터 30일 동안의 날짜를 확인
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(29);

        // 날짜 범위 내에서 반복
        for (LocalDate currentDate = startDate; !currentDate.isAfter(endDate); currentDate = currentDate.plusDays(1)) {
            // 사용되는 currentDate 변수를 effectively final로 만들기 위해, 새 변수로 복사합니다.
            final LocalDate dateToCheck = currentDate;

            // 현재 날짜가 예약된 범위와 겹치는지 체크
            boolean isAvailable = true;

            for (Reservation reservation : reservations) {
                LocalDate existingStartDate = reservation.getStartDate();
                LocalDate existingEndDate = reservation.getEndDate();

                // 현재 날짜가 기존 예약의 시작일과 종료일 사이에 있거나 같으면 예약 불가능
                if (!(dateToCheck.isBefore(existingStartDate) || dateToCheck.isAfter(existingEndDate))) {
                    isAvailable = false; // 겹치면 예약 불가능
                    break;
                }
            }

            // 날짜가 예약의 종료일과 같으면 예약 가능
            if (isAvailable || reservations.stream().anyMatch(reservation -> reservation.getEndDate().isEqual(dateToCheck))) {
                availableDates.add(dateToCheck);
            }
        }

        return availableDates;
    }
    
    // 중복된 예약이 있는지 확인하는 메서드
    public boolean isOverlappingReservation(Long roomId, LocalDate newStartDate, LocalDate newEndDate) {
        List<Reservation> existingReservations = reservationRepository.findByRoomId(roomId);

        for (Reservation reservation : existingReservations) {
            LocalDate existingStartDate = reservation.getStartDate();
            LocalDate existingEndDate = reservation.getEndDate();

            // 새로운 예약의 시작일과 종료일이 기존 예약의 범위와 겹치는지 확인
            if (newStartDate.isBefore(existingEndDate.plusDays(1)) && newEndDate.isAfter(existingStartDate.minusDays(1))) {
                return true; // 중복 예약이 있는 경우
            }
        }
        return false; // 중복 예약이 없는 경우
    }
}