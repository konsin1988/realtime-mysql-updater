export default function BackButton() {
    function goBack(){
        if (document.referrer){
            window.location.href = document.referrer;
        } else {
            window.history.back();
        }
    }

    return (
        <>
            <button 
                onClick={goBack}
                class="buttons"
                >
                Назад
            </button>
        </>
    );
}
