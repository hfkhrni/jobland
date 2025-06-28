// // components/BottomDrawer.tsx
// import React, { forwardRef, useCallback, useMemo } from "react";
// import { View } from "react-native";
// import BottomSheet, {
//   BottomSheetBackdrop,
//   BottomSheetView,
// } from "@gorhom/react-native-bottom-sheet";
// import type { BottomSheetBackdropProps } from "@gorhom/react-native-bottom-sheet";

// export interface BottomDrawerRef {
//   open: () => void;
//   close: () => void;
// }

// interface BottomDrawerProps {
//   children: React.ReactNode;
//   onClose?: () => void;
// }

// const BottomDrawer = forwardRef<BottomDrawerRef, BottomDrawerProps>(
//   ({ children, onClose }, ref) => {
//     const bottomSheetRef = React.useRef<BottomSheet>(null);

//     // Snap points for the bottom sheet
//     const snapPoints = useMemo(() => ["25%", "90%"], []);

//     // Backdrop component
//     const renderBackdrop = useCallback(
//       (props: BottomSheetBackdropProps) => (
//         <BottomSheetBackdrop
//           {...props}
//           disappearsOnIndex={-1}
//           appearsOnIndex={0}
//           opacity={0.5}
//           pressBehavior="close"
//         />
//       ),
//       []
//     );

//     // Handle sheet changes
//     const handleSheetChanges = useCallback(
//       (index: number) => {
//         if (index === -1) {
//           onClose?.();
//         }
//       },
//       [onClose]
//     );

//     // Expose methods to parent component
//     React.useImperativeHandle(ref, () => ({
//       open: () => {
//         bottomSheetRef.current?.expand();
//       },
//       close: () => {
//         bottomSheetRef.current?.close();
//       },
//     }));

//     return (
//       <BottomSheet
//         ref={bottomSheetRef}
//         index={-1}
//         snapPoints={snapPoints}
//         onChange={handleSheetChanges}
//         backdropComponent={renderBackdrop}
//         enablePanDownToClose
//         handleIndicatorStyle={{
//           backgroundColor: "#D1D5DB",
//           width: 48,
//           height: 4,
//         }}
//         backgroundStyle={{
//           backgroundColor: "white",
//           borderRadius: 24,
//         }}
//       >
//         <BottomSheetView style={{ flex: 1 }}>{children}</BottomSheetView>
//       </BottomSheet>
//     );
//   }
// );

// export default BottomDrawer;
